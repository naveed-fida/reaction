require 'test_helper'

class ListsAPITest < ActionDispatch::IntegrationTest
  class PostListsTest < ActionDispatch::IntegrationTest
    class ValidBoardIdTest < ActionDispatch::IntegrationTest
      class ValidDataTest < ActionDispatch::IntegrationTest
        def setup
          @board = create(:board)
        end

        test "creates a new list" do
          assert_equal 0, @board.lists.count

          post "/api/lists",
            params: { board_id: @board.id, list: { title: "My new list" } },
            headers: { 'Accept' => 'application/json' }

          assert_equal 1, @board.lists.count
        end

        test "returns a 201" do
          post "/api/lists",
            params: { board_id: @board.id, list: { title: "My new list" } },
            headers: { 'Accept' => 'application/json' }

          assert_response 201
        end

        test "returns the new list" do
          post "/api/lists",
            params: { board_id: @board.id, list: { title: "My new list" } },
            headers: { 'Accept' => 'application/json' }

          assert_equal @board.reload.lists.last.to_json, response.body
        end
      end

      class InvalidDataTest < ActionDispatch::IntegrationTest
        def setup
          board = create(:board)

          post "/api/lists",
            params: { board_id: board.id, list: { title: '' } },
            headers: { 'Accept' => 'application/json' }
        end

        test "returns a 422" do
          assert_response 422
        end

        test "includes error text in response" do
          assert JSON.parse(response.body).has_key?("error")
        end
      end
    end

    class InvalidBoardIdTest < ActionDispatch::IntegrationTest
      def setup
        post "/api/lists",
          params: { board_id: 'abc', list: { title: 'My new board' } },
          headers: { 'Accept' => 'application/json' }
      end

      test "returns a 404" do
        assert_response 404
      end

      test "includes error text in response" do
        assert JSON.parse(response.body).has_key?("error")
      end
    end
  end

  class PutListsTest < ActionDispatch::IntegrationTest
    class ValidListIdTest < ActionDispatch::IntegrationTest
      class ValidDataTest < ActionDispatch::IntegrationTest
        def setup
          @list = create(:list, position: 1.0)

          put "/api/lists/#{@list.id}",
              params: {
                list: { title: "New title", position: 10.123 }
              },
            headers: { 'Accept' => 'application/json' }
        end

        test "updates the list title" do
          assert_equal "New title", @list.reload.title
        end

        test "updates the list position" do
          assert_equal 10.123, @list.reload.position
        end

        test "returns a 200" do
          assert_response 200
        end

        test "returns the list" do
          assert_equal JSON.parse(@list.reload.to_json), JSON.parse(response.body)
        end
      end

      class InvalidDataTest < ActionDispatch::IntegrationTest
        def setup
          @list = create(:list, position: 1.0)

          put "/api/lists/#{@list.id}",
            params: { list: { title: "" } },
            headers: { 'Accept' => 'application/json' }
        end

        test "returns a 422" do
          assert_response 422
        end

        test "includes error text in response" do
          assert JSON.parse(response.body).has_key?("error")
        end
      end
    end

    class InvalidListIdTest < ActionDispatch::IntegrationTest
      def setup
        @list = create(:list, position: 1.0)

        put "/api/lists/abc",
          params: { list: { title: "My list" } },
          headers: { 'Accept' => 'application/json' }
      end

      test "returns a 404" do
        assert_response 404
      end

      test "includes error text in response" do
        assert JSON.parse(response.body).has_key?("error")
      end
    end
  end
end
