class AddDueDateToCards < ActiveRecord::Migration[5.1]
  def change
    change_table :cards do |t|
      t.datetime :due_date
    end
  end
end
