class AddPositionToCards < ActiveRecord::Migration[5.1]
  def change
    add_column :cards, :position, :float, precision: 15, scale: 10
  end
end
