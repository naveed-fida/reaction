require "application_system_test_case"

class BoardsDashboardTest < ApplicationSystemTestCase
  test "displaying no board tiles" do
    visit root_path

    assert_selector ".board-tile", count: 1
    assert_selector ".board-tile", text: "Create a new board..."
  end

  test "displaying one board tile" do
    create(:board, title: "My board")
    visit root_path

    assert_selector ".board-tile", count: 2
    assert_selector ".board-tile", text: "My board"
    assert_selector ".board-tile", text: "Create a new board..."
  end

  test "displaying more than one board tile" do
    create(:board, title: "My board")
    create(:board, title: "My other board")
    visit root_path

    assert_selector ".board-tile", count: 3
    assert_selector ".board-tile", text: "My board"
    assert_selector ".board-tile", text: "My other board"
    assert_selector ".board-tile", text: "Create a new board..."
  end

  class NewBoardTileTest < ApplicationSystemTestCase
    test "it can be toggled" do
      visit "/"

      refute_selector ".popover.new-board"

      find(".board-tile .new-board").click

      assert_selector ".popover.new-board"

      find(".popover.new-board .icon-close").click

      refute_selector ".popover.new-board"
    end
  end
end
