class CreateCards < ActiveRecord::Migration[5.1]
  def change
    create_table :cards do |t|
      t.string :title, nil: false
      t.text :description
      t.string :labels, array: true, default: [], nil: false
      t.integer :list_id, nil: false
    end
  end
end
