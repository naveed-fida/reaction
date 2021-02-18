class Card < ApplicationRecord
  include ActiveModel::Serializers::JSON

  belongs_to :list
  has_many :comments, dependent: :destroy
  has_many :actions, as: :actionable, dependent: :destroy

  validates_presence_of :title, :list_id

  delegate :board_id, to: :list

  def attributes
    super.merge("board_id" => board_id, "comments_count" => comments_count)
  end

  def comments_count
    comments.count
  end
end
