class CreateTimetable < ActiveRecord::Migration[5.1]
  def change
    create_table :timetables do |t|
      t.string :key
      t.text :data
      t.string :url
    end
    add_index :timetables, :key, unique: true
  end
end
