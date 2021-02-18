class Action < ApplicationRecord
  include ActiveModel::Serializers::JSON

  belongs_to :actionable, polymorphic: true

  def attributes
    super_attrs = super
    super_attrs.delete("actionable_id")
    super_attrs.delete("actionable_type")
    super_attrs["#{actionable_type.underscore}_id"] = actionable_id

    super_attrs
  end

  private

  def card_id
    actionable_id if actionable_type == "Card"
  end
end
