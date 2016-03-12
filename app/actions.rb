helpers do
  @keys = Key.all
end

get '/' do
  erb :index
end
