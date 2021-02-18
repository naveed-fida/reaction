require "application_system_test_case"

class ListsTest < ApplicationSystemTestCase
  def setup
    @board = create(:board)
    visit "/boards/#{@board.id}"
  end

  test "showing then hiding the new list form" do
    refute_selector ".new-list.selected"
    refute_selector ".new-list input[type='text']"

    find(".new-list").click

    assert_selector ".new-list.selected"
    assert_selector ".new-list input[type='text']"

    find(".new-list .x-icon").click

    refute_selector ".new-list.selected"
    refute_selector ".new-list input[type='text']"
  end

  test "creating a list using the submit button" do
    find(".new-list").click

    within ".new-list" do
      find("input[type='text']").set("My new list")
      click_on "Save"
    end

    assert_selector "p.list-title", text: "My new list"
  end

  test "creating a list using the enter key" do
    find(".new-list").click

    within ".new-list" do
      input = find("input[type='text']")
      input.set("My new list")
      input.send_keys :enter
    end

    assert_selector "p.list-title", text: "My new list"
  end

  test "displaying no lists" do
    visit "/boards/#{@board.id}"
    refute_selector ".existing-lists .list-wrapper"
  end

  test "displaying one list" do
    create(:list, board: @board)
    visit "/boards/#{@board.id}"
    assert_selector ".existing-lists .list-wrapper", count: 1
  end

  test "displaying more than one list" do
    2.times { create(:list, board: @board) }
    visit "/boards/#{@board.id}"
    assert_selector ".existing-lists .list-wrapper", count: 2
  end

  test "changing a list title" do
    create(:list, board: @board)
    visit "/boards/#{@board.id}"

    title = find('p.list-title')

    title.click
    title_input = find('input.list-title')
    title_input.set("Updated title")
    title_input.send_keys :enter

    assert_selector "p.list-title", text: "Updated title"
    assert_equal "Updated title", @board.lists.first.title
  end

  test "shows the correct card icons" do
    list = create(:list, board: @board)
    create(:card, list: list, due_date: nil, description: "")

    visit "/boards/#{@board.id}"

    refute_selector ".card .clock-icon"
    refute_selector ".card .description-icon"
    refute_selector ".card .comment-icon"

    find(".card").click
    find("li", text: "Due Date").click
    within ".popover" do
      click_on "Save"
    end
    find(".close-modal").click

    assert_selector ".card .clock-icon"
    refute_selector ".card .description-icon"
    refute_selector ".card .comment-icon"

    find(".card").click
    find("#description-edit").click
    find(".textarea-toggle").set("My description")
    find(".description .button", text: "Save").click
    find(".close-modal").click

    assert_selector ".card .clock-icon"
    assert_selector ".card .description-icon"
    refute_selector ".card .comment-icon"

    find(".card").click
    find(".comment textarea").set("My comment")
    within ".comment-section" do
      click_on "Save"
    end
    find(".close-modal").click

    assert_selector ".card .clock-icon"
    assert_selector ".card .description-icon"
    assert_selector ".card .comment-icon"
  end
end
