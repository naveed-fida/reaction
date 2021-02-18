class ActionTests < ActiveSupport::TestCase
  test "json representation includes model_id" do
    action = create(:action, actionable: create(:card))

    json = action.as_json
    assert json.has_key?("card_id")
  end

  test "json representation doesn't include polymorphic id" do
    action = create(:action, actionable: create(:card))

    json = action.as_json
    refute json.has_key?("actionable_id")
    refute json.has_key?("actionable_type")
  end
end
