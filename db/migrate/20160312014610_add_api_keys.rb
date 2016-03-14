class AddApiKeys < ActiveRecord::Migration
  def change
    create_table :keys do |t|
      t.string :site
      t.string :key
      t.timestamps
    end
  end
end
