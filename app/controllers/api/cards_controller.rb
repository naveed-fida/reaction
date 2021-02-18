class Api::CardsController < ApplicationController
  def create
    list = List.find(params[:list_id])
    copy_from = params[:card][:copy_from]
    copy_from_card = Card.find(copy_from) if copy_from

    if copy_from
      @card = copy_from_card.dup
      @card.assign_attributes(card_params)
      @card.list = List.find(params[:list_id])
    else
      @card = list.cards.new(card_params)
    end

    ActiveRecord::Base.transaction do
      if @card.save
        create_actions(@card, new: true)
        clone_comments(copy_from_card, @card) if clone_comments?

        render :create, status: :created
      else
        @error = @card.errors.full_messages.join(', ')
        render 'api/shared/error', status: :unprocessable_entity
      end
    end
  rescue ActiveRecord::RecordNotFound
    @error = "Invalid list id provided"
    render 'api/shared/error', status: :not_found
  end

  def show
    @card = Card.find(params[:id])
    render :show
  rescue ActiveRecord::RecordNotFound
    @error = "Invalid card id provided"
    render 'api/shared/error', status: :not_found
  end

  def update
    @card = Card.find(params[:id])
    @card.assign_attributes(card_params)

    ActiveRecord::Base.transaction do
      create_actions(@card) if @card.valid?

      if @card.save
        render :update
      else
        @error = @card.errors.full_messages.join(', ')
        render 'api/shared/error', status: :unprocessable_entity
      end
    end
  rescue ActiveRecord::RecordNotFound
    @error = "Invalid card id provided"
    render 'api/shared/error', status: :not_found
  end

  private

  def card_params
    params.require(:card).permit(
      :title, :list_id, :position, :description, :archived, :due_date,
      :completed, labels: []
    )
  end

  def create_actions(card, options = {})
    if options[:new]
      if card_id = params[:card][:copy_from]
        original_card = Card.find(card_id)
        card.actions.create!(description: " copied this card from #{original_card.title} in list #{original_card.list.title}")
      else
        card.actions.create!(description: " added this card to #{card.list.title}")
      end

      return
    end

    if card.due_date_changed?
      if card.due_date
        if card.due_date.year == Date.today.year
          due_date = card.due_date.strftime("%b %e at %l:%M %p")
        else
          due_date = card.due_date.strftime("%b %e, %Y at %l:%M %p")
        end

        if card.due_date_was
          card.actions.create!(description: " changed the due date of this card to #{due_date}")
        else
          card.actions.create!(description: " set the due date of this card to #{due_date}")
        end
      else
        card.actions.create!(description: " removed the due date from this card")
      end
    end

    if card.completed_changed?
      completion = card.completed ? "complete" : "incomplete"
      card.actions.create!(description: " marked the due date #{completion}")
    end

    if card.list_id_changed?
      old_list = List.find(card.list_id_was)

      if old_list.board == card.list.board
        card.actions.create!(
          description: "moved this card from #{old_list.title} to #{card.list.title}"
        )
      else
        card.actions.create!(
          description: "transferred this card from #{old_list.board.title}"
        )
      end
    end

    if card.archived_changed?
      if card.archived?
        card.actions.create!(description: " archived this card")
      else
        card.actions.create!(description: " sent this card to the board")
      end
    end
  end

  def clone_comments?
    params.dig(:card, :keep, :comments) == "true"
  end

  def clone_comments(from, to)
    from.comments.find_each do |comment|
      new_comment = comment.dup
      new_comment.card = to
      new_comment.save!
    end
  end
end
