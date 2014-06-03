# Guardfile for the jQuery mmenu plugin javascript files.
# Basically, all non-minified files in the "src/js" directory are minified.

# For some reason, uglify only seems to work if the input and output is the same file.
# Therefor, we need to copy the contents from the original files to the minified files (using concat) before they can be minified.

# Minify core functionality (on canvas)
guard :concat, type: "js", files: %w(jquery.mmenu.oncanvas), input_dir: "src/js", output: "src/js/jquery.mmenu.oncanvas.min"
guard 'uglify', :destination_file => "src/js/jquery.mmenu.oncanvas.min.js" do
  watch ('src/js/jquery.mmenu.oncanvas.min.js')
end

# Minify addons
guard :concat, type: "js", files: %w(jquery.mmenu.offcanvas), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.offcanvas.min"
guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.offcanvas.min.js" do
  watch ('src/js/addons/jquery.mmenu.offcanvas.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.counters), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.counters.min"
guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.counters.min.js" do
  watch ('src/js/addons/jquery.mmenu.counters.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.dragopen), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.dragopen.min"
guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.dragopen.min.js" do
  watch ('src/js/addons/jquery.mmenu.dragopen.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.header), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.header.min"
guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.header.min.js" do
  watch ('src/js/addons/jquery.mmenu.header.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.labels), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.labels.min"
guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.labels.min.js" do
  watch ('src/js/addons/jquery.mmenu.labels.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.searchfield), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.searchfield.min"
guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.searchfield.min.js" do
  watch ('src/js/addons/jquery.mmenu.searchfield.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.toggles), input_dir: "src/js/addons", output: "src/js/addons/jquery.mmenu.toggles.min"
guard 'uglify', :destination_file => "src/js/addons/jquery.mmenu.toggles.min.js" do
  watch ('src/js/addons/jquery.mmenu.toggles.min.js')
end

# Concatenate core functionality + off canvas
guard :concat, type: "js", files: %w(jquery.mmenu.oncanvas.min addons/jquery.mmenu.offcanvas.min), input_dir: "src/js", output: "src/js/jquery.mmenu.min"

# Concatenate core functionality + off canvas + addons
guard :concat, type: "js", files: %w(jquery.mmenu.min addons/jquery.mmenu.counters.min addons/jquery.mmenu.dragopen.min addons/jquery.mmenu.header.min addons/jquery.mmenu.labels.min addons/jquery.mmenu.searchfield.min), input_dir: "src/js", output: "src/js/jquery.mmenu.min.all"

# Umd all minified files
guard :concat, type: "js", files: %w(umd/inc/umd_prefix jquery.mmenu.oncanvas.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/jquery.mmenu.oncanvas.umd"
guard :concat, type: "js", files: %w(umd/inc/umd_prefix addons/jquery.mmenu.offcanvas.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/addons/jquery.mmenu.offcanvas.umd"
guard :concat, type: "js", files: %w(umd/inc/umd_prefix jquery.mmenu.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/jquery.mmenu.umd"

guard :concat, type: "js", files: %w(umd/inc/umd_prefix addons/jquery.mmenu.counters.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/addons/jquery.mmenu.counters.umd"
guard :concat, type: "js", files: %w(umd/inc/umd_prefix addons/jquery.mmenu.dragopen.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/addons/jquery.mmenu.dragopen.umd"
guard :concat, type: "js", files: %w(umd/inc/umd_prefix addons/jquery.mmenu.header.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/addons/jquery.mmenu.header.umd"
guard :concat, type: "js", files: %w(umd/inc/umd_prefix addons/jquery.mmenu.labels.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/addons/jquery.mmenu.labels.umd"
guard :concat, type: "js", files: %w(umd/inc/umd_prefix addons/jquery.mmenu.searchfield.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/addons/jquery.mmenu.searchfield.umd"
guard :concat, type: "js", files: %w(umd/inc/umd_prefix addons/jquery.mmenu.toggles.min umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/addons/jquery.mmenu.toggles.umd"

guard :concat, type: "js", files: %w(umd/inc/umd_prefix jquery.mmenu.min.all umd/inc/umd_affix), input_dir: "src/js", output: "src/js/umd/jquery.mmenu.umd.all"