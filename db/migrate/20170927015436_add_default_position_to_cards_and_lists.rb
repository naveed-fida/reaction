class AddDefaultPositionToCardsAndLists < ActiveRecord::Migration[5.1]
  def change
    change_column_default :lists, :position, 65535
    change_column_default :cards, :position, 65535
  end
end
