# Guardfile for the jQuery mmenu plugin javascript files.
# Basically, all non-minified files in the "src/js" directory are minified in the "dist/js" directory.

# For some reason, uglify only seems to work if the input and output is the same file.
# Therefor, we need to copy the contents from the original files to the minified files (using concat) before they can be minified.
# IMHO, this is pretty idiotic.




# Minify core functionality (oncanvas)

guard :concat, type: "js", files: %w(jquery.mmenu.oncanvas), input_dir: "src/js", output: "dist/js/jquery.mmenu.oncanvas.min"
guard 'uglify', :destination_file => "dist/js/jquery.mmenu.oncanvas.min.js" do
  watch ('dist/js/jquery.mmenu.oncanvas.min.js')
end




# Minify addons

guard :concat, type: "js", files: %w(jquery.mmenu.autoheight), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.autoheight.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.autoheight.min.js" do
  watch ('dist/js/addons/jquery.mmenu.autoheight.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.backbutton), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.backbutton.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.backbutton.min.js" do
  watch ('dist/js/addons/jquery.mmenu.backbutton.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.counters), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.counters.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.counters.min.js" do
  watch ('dist/js/addons/jquery.mmenu.counters.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.dividers), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.dividers.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.dividers.min.js" do
  watch ('dist/js/addons/jquery.mmenu.dividers.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.dragopen), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.dragopen.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.dragopen.min.js" do
  watch ('dist/js/addons/jquery.mmenu.dragopen.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.fixedelements), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.fixedelements.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.fixedelements.min.js" do
  watch ('dist/js/addons/jquery.mmenu.fixedelements.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.navbars), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.navbars.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.navbars.min.js" do
  watch ('dist/js/addons/jquery.mmenu.navbars.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.offcanvas), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.offcanvas.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.offcanvas.min.js" do
  watch ('dist/js/addons/jquery.mmenu.offcanvas.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.searchfield), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.searchfield.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.searchfield.min.js" do
  watch ('dist/js/addons/jquery.mmenu.searchfield.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.sectionindexer), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.sectionindexer.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.sectionindexer.min.js" do
  watch ('dist/js/addons/jquery.mmenu.sectionindexer.min.js')
end

guard :concat, type: "js", files: %w(jquery.mmenu.toggles), input_dir: "src/js/addons", output: "dist/js/addons/jquery.mmenu.toggles.min"
guard 'uglify', :destination_file => "dist/js/addons/jquery.mmenu.toggles.min.js" do
  watch ('dist/js/addons/jquery.mmenu.toggles.min.js')
end




# Concatenate core functionality + offcanvas

guard :concat, type: "js", files: %w(jquery.mmenu.oncanvas.min addons/jquery.mmenu.offcanvas.min), input_dir: "dist/js", output: "dist/js/jquery.mmenu.min"




# Concatenate core functionality + offcanvas + addons

guard :concat, type: "js", files: %w(jquery.mmenu.min addons/jquery.mmenu.autoheight.min addons/jquery.mmenu.backbutton.min addons/jquery.mmenu.counters.min addons/jquery.mmenu.dividers.min addons/jquery.mmenu.dragopen.min addons/jquery.mmenu.fixedelements.min addons/jquery.mmenu.navbars.min addons/jquery.mmenu.searchfield.min addons/jquery.mmenu.sectionindexer.min addons/jquery.mmenu.toggles.min), input_dir: "dist/js", output: "dist/js/jquery.mmenu.min.all"




# Umd all minified files

guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/jquery.mmenu.oncanvas.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/jquery.mmenu.oncanvas.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/jquery.mmenu.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/jquery.mmenu.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/jquery.mmenu.min.all js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/jquery.mmenu.umd.all"

guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.autoheight.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.autoheight.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.backbutton.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.backbutton.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.counters.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.counters.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.dividers.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.dividers.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.dragopen.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.dragopen.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.fixedelements.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.fixedelements.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.navbars.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.navbars.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.offcanvas.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.offcanvas.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.searchfield.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.searchfield.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.sectionindexer.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.searchfield.umd"
guard :concat, type: "js", files: %w(js_umd/_inc/prefix js/addons/jquery.mmenu.toggles.min js_umd/_inc/affix), input_dir: "dist", output: "dist/js_umd/addons/jquery.mmenu.toggles.umd"
