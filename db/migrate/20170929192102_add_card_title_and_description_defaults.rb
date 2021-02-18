class AddCardTitleAndDescriptionDefaults < ActiveRecord::Migration[5.1]
  def change
    change_column_null :cards, :title, false, ''
    change_column_null :cards, :description, false, ''

    change_column_default :cards, :title, ''
    change_column_default :cards, :description, ''
  end
end
