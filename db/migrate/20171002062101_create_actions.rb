class CreateActions < ActiveRecord::Migration[5.1]
  def change
    create_table :actions do |t|
      t.string :description, nil: false, default: ''
      t.belongs_to :actionable, polymorphic: true
      t.timestamps
    end
  end
end
