helpers do
  @keys = Key.all
end

get '/' do
  erb :index
end

get '/500px' do #NOTE: has access to params from the request URL
  key = Key.where(site: '500px').first.key
  uri = URI("https://api.500px.com/v1/photos?consumer_key=#{key}&feature=highest_rated&image_size=3")
  Net::HTTP.get(uri)
end

get '/gmaps' do
  key = Key.where(site: 'gmaps').first.key
  # NOTE: incomplete
end
