get '/' do
  erb :index
end

get '/500px' do #NOTE: has access to params from the request URL
  key = Key.where(site: '500px').first.key
  params[:consumer_key] = key
  uri = URI('https://api.500px.com/v1/photos')
  uri.query = URI.encode_www_form(params)
  Net::HTTP.get(uri)
end

get '/mapbox/v4/marker/:file' do
  key = Key.where(site: 'mapbox').first.key
  uri = URI("http://a.tiles.mapbox.com/v4/marker/#{params[:captures][0]}?access_token=#{key}")
  Net::HTTP.get(uri)
end

get '/mapbox/v4/:resource' do
  key = Key.where(site: 'mapbox').first.key
  uri = URI("http://a.tiles.mapbox.com/v4/#{params[:captures][0]}?access_token=#{key}")
  Net::HTTP.get(uri)
end

get '/test' do
  headers 'Access-Control-Allow-Origin' => ['http://500maps.billiam.io/','http://stormy-beach-93992.herokuapp.com/']
  'access granted'
end
