json.merge! @board.attributes

json.lists(@board.lists) do |list|
  json.merge! list.attributes

  json.cards(list.cards.where(archived: :false)) do |card|
    json.id card.id
    json.title card.title
    json.due_date card.due_date
    json.labels card.labels
    json.description card.description
    json.list_id card.list_id
    json.board_id @board.id
    json.position card.position
    json.comments_count card.comments_count
  end
end
