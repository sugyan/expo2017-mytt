json.array! @data do |item|
  json.id     item[:id]
  json.start  item[:start].to_i
  json.end    item[:end].to_i
  json.stage  item[:stage]
  json.color  item[:color]
  json.artist item[:artist]
  json.detail item[:detail]
  json.stage_key item[:stage_key]
end
