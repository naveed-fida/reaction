require 'test_helper'

class CommentsAPITest < ActionDispatch::IntegrationTest
  class PostCommentsTest < ActionDispatch::IntegrationTest
    class ValidCardIdTest < ActionDispatch::IntegrationTest
      class ValidDataTest < ActionDispatch::IntegrationTest
        def setup
          @card = create(:card)

          test "creates a new comment" do
            assert_equal 0, @card.comments.count

            post "/api/comments",
              params: { card_id: @card.id, comment: { text: "A new comment" }},
              headers: { 'Accept' => 'application/json' }

            assert_equal 1, @card.comments.count
          end

          test "returns a 201" do
            post "/api/comments",
              params: { card_id: @card.id, comment: { text: "A new comment" }},
              headers: { 'Accept' => 'application/json' }


            assert_response 201
          end

          test "returns the new comment" do
            post "/api/comments",
              params: { card_id: @card.id, comment: { text: "A new comment" }},
              headers: { 'Accept' => 'application/json' }


            assert_equal @card.reload.comments.last.to_json, response.body
          end
        end
      end

      class InvalidDataTest < ActionDispatch::IntegrationTest
        def setup
          card = create(:card)

          post "/api/comments",
            params: { card_id: card.id, comment: { text: "" }},
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

    class InvalidCardIdTest < ActionDispatch::IntegrationTest
      def setup
        post "/api/comments",
          params: { card_id: "abc", comment: { text: "" }},
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
