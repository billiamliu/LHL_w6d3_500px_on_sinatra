class Key < ActiveRecord::Base

  validates :site, uniqueness: true
  validates :key, uniqueness: true

end
