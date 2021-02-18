class CardTests < ActiveSupport::TestCase
  test "json representation includes board_id" do
    card = create(:card)

    json = card.as_json
    assert json.has_key?("board_id")
  end
end
