require "application_system_test_case"

class CardsTest < ApplicationSystemTestCase
  def setup
    @board = create(:board)
    @list = create(:list, board: @board)
    visit "/boards/#{@board.id}"
  end

  test "showing then hiding the new card form" do
    refute_selector "textarea[name='add-card']", visible: true

    find(".add-card-toggle").click

    assert_selector "textarea[name='add-card']", visible: true

    find(".add-dropdown.add-bottom .x-icon").click

    refute_selector "textarea[name='add-card']", visible: true
  end

  test "new card form can only be visible on one list at a time" do
    create(:list, board: @board)
    visit "/boards/#{@board.id}"

    assert_selector ".add-card-toggle"

    toggles = all(".add-card-toggle")
    toggles.first.click

    within all(".list-wrapper").first do
      assert_selector "textarea[name='add-card']", visible: true
    end
    within all(".list-wrapper").last do
      refute_selector "textarea[name='add-card']", visible: true
    end

    toggles.last.click

    within all(".list-wrapper").first do
      refute_selector "textarea[name='add-card']", visible: true
    end
    within all(".list-wrapper").last do
      assert_selector "textarea[name='add-card']", visible: true
    end
  end

  test "new card form retains value when moving between lists" do
    create(:list, board: @board)
    visit "/boards/#{@board.id}"

    assert_selector ".add-card-toggle"

    toggles = all(".add-card-toggle")
    toggles.first.click

    find("[name='add-card']").set("My card")
    toggles.last.click

    within all(".list-wrapper").last do
      assert_selector "textarea[name='add-card']", text: "My card"
    end
  end

  test "creating a list using the submit button" do
    find(".add-card-toggle").click
    find("[name='add-card']").set("My card")
    find(".button", text: "Add").click

    assert_selector ".card-info p", text: "My card"
    refute_selector "textarea[name='add-card']", text: "My card"
  end

  test "creating a list using the enter key" do
    find(".add-card-toggle").click
    input = find("[name='add-card']")
    input.set("My card")
    input.send_keys :enter

    assert_selector ".card-info p", text: "My card"
    refute_selector "textarea[name='add-card']", text: "My card"
    assert_selector "textarea[name='add-card']", text: ""
  end

  test "displaying no lists" do
    assert_selector "#cards-container .card", count: 0
  end

  test "displaying one list" do
    create(:card, list: @list)
    visit "/boards/#{@board.id}"
    assert_selector "#cards-container .card", count: 1
  end

  test "displaying more than one list" do
    2.times { create(:card, list: @list) }

    visit "/boards/#{@board.id}"
    assert_selector "#cards-container .card", count: 2
  end

  test "clicking on a card shows it" do
    card = create(:card, list: @list)

    visit "/boards/#{@board.id}"
    find("#cards-container .card").click

    assert_selector "#modal"

    assert_equal "/cards/#{card.id}", current_path
  end

  test "user navigates directly to card" do
    card = create(:card, list: @list)

    visit "/cards/#{card.id}"

    assert has_content?(@list.board.title)
    assert has_content?(@list.title)
    assert has_content?(card.title)
  end

  test "user edits card" do
    card = create(:card, list: @list)

    visit "/cards/#{card.id}"

    input = find("#modal-container .list-title")
    input.click
    input.set("My new title")
    input.send_keys :enter

    find("#description-edit").click
    input = find(".description .textarea-toggle")
    input.set("My description")

    find(".description .button[value='Save']").click

    refute_selector ".description .button[value='Save']"
    refute_selector ".description .description-edit-options"

    card.reload

    assert_equal "My new title", card.title
    assert_equal "My description", card.description
  end

  test "user archives and unarchives card" do
    card = create(:card, list: @list)

    visit "/cards/#{card.id}"

    find(".archive-button").click

    assert_selector ".archived-banner"
    assert has_content?("This card is archived.")
    refute_selector ".archive-button"
    assert_selector ".unarchive-button"
    assert_selector ".red-button", text: "Delete"

    card.reload

    assert card.archived

    find(".unarchive-button").click

    refute_selector ".archived-banner"
    refute has_content?("This card is archived.")
    assert_selector ".archive-button"
    refute_selector ".unarchive-button"
    refute_selector ".red-button", text: "Delete"

    card.reload

    refute card.archived
  end

  test "user adds a comment" do
    card = create(:card, list: @list)

    visit "/cards/#{card.id}"

    input = find(".comment textarea")
    input.set("This is my comment")

    submit = find(".comment [type='submit']")
    submit.click

    assert_selector ".comment.static-comment", text: "This is my comment"

    card.reload

    assert_equal 1, card.comments.count
  end

  test "user adds a due date" do
    card = create(:card, list: @list)

    visit "/cards/#{card.id}"

    find('li', text: "Due Date").click

    click_button "13"
    find(".datepicker-select-time input").set("1:17 AM")

    click_on "Save"

    assert_selector "#dueDateDisplay", text: Date.today.strftime("%b 13 at 1:17 AM")
  end

  test "user changes a due date by clicking on the date" do
    card = create(:card, list: @list, due_date: 2.months.from_now)

    visit "/cards/#{card.id}"

    find("#dueDateDisplay").click

    click_on "13"
    find(".datepicker-select-time input").set("1:17 AM")

    click_on "Save"

    assert_selector "#dueDateDisplay", text: 2.months.from_now.strftime("%b 13 at 1:17 AM")

    refute_equal card.due_date, card.reload.due_date
  end

  test "user completes a card" do
    card = create(:card, list: @list, due_date: 1.month.from_now)

    visit "/cards/#{card.id}"

    refute_selector("#dueDateCheckbox.completed")

    find("#dueDateCheckbox").click

    assert_selector("#dueDateDisplay.completed")

    assert card.reload.completed
  end

  test "user removes a due date" do
    card = create(:card, list: @list, due_date: 1.month.from_now)

    visit "/cards/#{card.id}"

    find("#dueDateDisplay").click

    click_on "Remove"

    refute_selector "#dueDateDisplay"

    assert_nil card.reload.due_date
  end

  test "user closes the due date popover" do
    card = create(:card, list: @list, due_date: 1.month.from_now)
    visit "/cards/#{card.id}"

    find("#dueDateDisplay").click

    find(".icon-close").click

    refute_selector "#popover.due-date"
  end

  test "user adds a label using the Labels button" do
    card = create(:card)
    visit "/cards/#{card.id}"

    refute_selector ".labels-section"

    find(".label-button").click
    find(".popover .green.colorblindable").click

    assert_selector ".labels-section .green.label.colorblindable", count: 1

    find(".labels-section .green.label.colorblindable").click
    find(".popover .green.colorblindable").click

    assert_selector ".labels-section .green.label.colorblindable", count: 0
  end

  test "shows the correct list link" do
    card = create(:card)
    visit "/cards/#{card.id}"

    assert_selector(".link", text: card.list.title)
  end

  test "moving a card within the same list" do
    board = create(:board)
    list = create(:list, board: board)
    card = create(:card, position: 1, list: list)
    create(:card, position: 2, list: list)
    create(:card, position: 3, list: list)
    visit "/cards/#{card.id}"

    find("li", text: "Move").click

    assert_selector ".button-link.setting.position option", text: "1 (current)"

    within ".button-link.setting.position" do
      select "2"
    end

    within ".popover" do
      click_on "Move"
    end

    refute_selector ".popover"

    find("li", text: "Move").click
    assert_selector ".button-link.setting.position option", text: "2 (current)"

    card.reload

    assert_equal board.id, card.board_id
    assert_equal list, card.list
    assert_equal 2.5, card.position

    # a move action should only be generated when list is changed
    refute has_content? "moved this card"
  end

  test "moving a card to another list within the same board" do
    board = create(:board)
    list = create(:list, board: board, position: 1)
    list2 = create(:list, board: board, position: 2)
    create(:list, board: board)
    card = create(:card, position: 1, list: list)
    card2 = create(:card, position: 2, list: list2)
    visit "/cards/#{card.id}"

    find("li", text: "Move").click

    assert_selector ".button-link.setting.list option", text: "#{list.title} (current)"

    within ".button-link.setting.list" do
      select list2.title
    end

    within ".popover" do
      click_on "Move"
    end

    refute_selector ".popover"

    find("li", text: "Move").click
    assert_selector ".button-link.setting.list option", text: "#{list2.title} (current)"

    card.reload

    assert_equal board.id, card.board_id
    assert_equal list2, card.list
    assert card.position > card2.position

    assert has_content? "moved this card from #{list.title} to #{list2.title}"
  end

  test "moving a card to a list on another board" do
    board = create(:board)
    board2 = create(:board)
    list = create(:list, board: board)
    list2 = create(:list, board: board2)
    card = create(:card, position: 1, list: list)
    visit "/cards/#{card.id}"

    find("li", text: "Move").click

    assert_selector ".button-link.setting.board option", text: "#{board.title} (current)"
    refute_selector ".button-link.setting.board option", text: "#{board2.title} (current)"

    within ".button-link.setting.board" do
      select board2.title
    end

    within ".popover" do
      click_on "Move"
    end

    refute_selector ".popover"
    refute_selector "#modal"
    assert "/boards/#{board.id}", current_path

    visit "/cards/#{card.id}"

    find("li", text: "Move").click
    refute_selector ".button-link.setting.board option", text: "#{board.title} (current)"
    assert_selector ".button-link.setting.board option", text: "#{board2.title} (current)"
    assert_selector ".button-link.setting.list option", text: "#{list2.title} (current)"
    assert_selector ".button-link.setting.position option", text: "1 (current)"

    card.reload

    assert_equal board2.id, card.board_id
    assert_equal list2, card.list

    assert has_content? "transferred this card from #{board.title}"
  end

  test "copying a card to the same list" do
    board = create(:board)
    list = create(:list, board: board)
    card = create(:card, position: 1, list: list)
    visit "/cards/#{card.id}"

    assert_equal 1, Card.count

    find("li", text: "Copy").click

    assert_selector ".button-link.setting.position option", text: "1 (current)"

    within ".button-link.setting.position" do
      select "2"
    end

    within ".popover" do
      click_on "Create Card"
    end

    refute_selector ".popover"

    assert_equal "/cards/#{card.id}", current_path

    assert_equal 2, Card.count

    new_card = Card.last

    assert_equal card.list, new_card.list
    assert new_card.position > card.position

    # a move action should only be generated when list is changed
    refute has_content? "moved this card"
  end

  test "copying a card to another list within the same board" do
    board = create(:board)
    list = create(:list, board: board)
    list2 = create(:list, board: board)
    card = create(:card, position: 1, list: list)
    visit "/cards/#{card.id}"

    assert_equal 1, Card.count

    find("li", text: "Copy").click

    assert_selector ".button-link.setting.position option", text: "1 (current)"

    within ".button-link.setting.list" do
      select list2.title
    end

    within ".popover" do
      click_on "Create Card"
    end

    refute_selector ".popover"

    assert_equal "/cards/#{card.id}", current_path

    assert_equal 2, Card.count

    new_card = Card.last

    assert_equal list2, new_card.list

    # a move action should only be generated when list is changed
    refute has_content? "moved this card"
  end

  test "copying a card to another board" do
    board = create(:board)
    board2 = create(:board)
    list = create(:list, board: board)
    list2 = create(:list, board: board2)
    card = create(:card, position: 1, list: list)
    visit "/cards/#{card.id}"

    assert_equal 1, Card.count

    find("li", text: "Copy").click

    assert_selector ".button-link.setting.position option", text: "1 (current)"

    within ".button-link.setting.board" do
      select board2.title
    end

    within ".popover" do
      click_on "Create Card"
    end

    refute_selector ".popover"

    assert_equal "/cards/#{card.id}", current_path

    assert_equal 2, Card.count

    new_card = Card.last

    assert_equal list2, new_card.list

    # a move action should only be generated when list is changed
    refute has_content? "moved this card"
  end
end
