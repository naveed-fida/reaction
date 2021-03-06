require "application_system_test_case"

class BoardsTest < ApplicationSystemTestCase
  class CreatingBoardsTest < ApplicationSystemTestCase
    test "creating with a blank title does not save the board" do
      visit "/"

      find(".board-tile").click

      within ".popover.new-board" do
        find("input[type='text']").set("")
        click_on "Create"
      end

      assert_equal Board.count, 0
      assert_selector ".popover.new-board input[type='text']"
    end

    test "creating a board successfully" do
      visit "/"

      find(".board-tile").click

      within ".popover.new-board" do
        find("input[type='text']").set("My board")
        click_on "Create"
      end

      refute_selector ".popover.new-board input[type='text']"
      assert_equal 1, Board.count
    end
  end
end
