class AddTimestampsToCardsAndComments < ActiveRecord::Migration[5.1]
  def change
    change_table :cards do |t|
      t.timestamps
    end

    change_table :comments do |t|
      t.timestamps
    end
  end
end
