# Guardfile for the jQuery mmenu plugin javascript files.
# Basically, all non-minified files in the "src/js" directory are minified.

# For some reason, uglify only seems to work if the input and output is the same file.
# Therefor, we need to copy the contents from the original files to the minified files (using concat) before they can be minified.
guard :concat, type: "js", files: %w(jquery.mmenu), input_dir: "src/js", output: "src/js/jquery.mmenu.min"
guard :concat, type: "js", files: %w(jquery.mmenu.counters), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.counters.min"
guard :concat, type: "js", files: %w(jquery.mmenu.dragopen), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.dragopen.min"
guard :concat, type: "js", files: %w(jquery.mmenu.header), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.header.min"
guard :concat, type: "js", files: %w(jquery.mmenu.labels), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.labels.min"
guard :concat, type: "js", files: %w(jquery.mmenu.searchfield), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.searchfield.min"

# Minify all js files seporately.
guard 'uglify', :destination_file => "src/js/jquery.mmenu.min.js" do
  watch ('src/js/jquery.mmenu.min.js')
end

guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.counters.min.js" do
  watch ('src/js/addons/jquery.mmenu.counters.min.js')
end

guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.dragopen.min.js" do
  watch ('src/js/addons/jquery.mmenu.dragopen.min.js')
end

guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.header.min.js" do
  watch ('src/js/addons/jquery.mmenu.header.min.js')
end

guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.labels.min.js" do
  watch ('src/js/addons/jquery.mmenu.labels.min.js')
end

guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.searchfield.min.js" do
  watch ('src/js/addons/jquery.mmenu.searchfield.min.js')
end

# Concatenate all minified js files into one
guard :concat, type: "js", files: %w(jquery.mmenu.min addons/jquery.mmenu.counters.min addons/jquery.mmenu.dragopen.min addons/jquery.mmenu.header.min addons/jquery.mmenu.labels.min addons/jquery.mmenu.searchfield.min), input_dir: "src/js", output: "src/js/jquery.mmenu.min.all"