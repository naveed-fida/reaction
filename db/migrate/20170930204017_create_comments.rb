class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.text :text, default: '', nil: false
      t.integer :card_id, index: true, nil: false
    end
  end
end
