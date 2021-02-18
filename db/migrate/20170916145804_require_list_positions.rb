class RequireListPositions < ActiveRecord::Migration[5.1]
  def up
    change_column_default :lists, :position, 0
    List.find_each { |l| l.update!(position: 0) unless l.position }

    change_column_null :lists, :position, false
  end

  def down
    change_column_default :lists, :position, nil
    List.find_each { |l| l.update!(position: 0) unless l.position }

    change_column_null :lists, :position, true
  end
end
