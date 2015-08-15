# Guardfile for the jQuery mmenu plugin javascript files.
# Basically, all non-minified files in the "src" directory are minified in the "dist" directory.




# Minify core (oncanvas)

guard :concat,
  type: "js",
  output: "dist/core/js/jquery.mmenu.oncanvas.min",
  input_dir: "src/core/js",
  files: %w(jquery.mmenu.oncanvas)

guard 'uglify', :destination_file => "dist/core/js/jquery.mmenu.oncanvas.min.js" do
  watch ('dist/core/js/jquery.mmenu.oncanvas.min.js')
end




# Minify addons

guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.autoheight.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.autoheight)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.autoheight.min.js" do
  watch ('dist/addons/js/jquery.mmenu.autoheight.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.backbutton.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.backbutton)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.backbutton.min.js" do
  watch ('dist/addons/js/jquery.mmenu.backbutton.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.counters.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.counters)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.counters.min.js" do
  watch ('dist/addons/js/jquery.mmenu.counters.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.dividers.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.dividers)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.dividers.min.js" do
  watch ('dist/addons/js/jquery.mmenu.dividers.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.dragopen.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.dragopen)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.dragopen.min.js" do
  watch ('dist/addons/js/jquery.mmenu.dragopen.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.fixedelements.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.fixedelements)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.fixedelements.min.js" do
  watch ('dist/addons/js/jquery.mmenu.fixedelements.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.iconpanels.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.iconpanels)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.iconpanels.min.js" do
  watch ('dist/addons/js/jquery.mmenu.iconpanels.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.navbars.min",
  input_dir: "src/addons/js",
  files: %w(
    jquery.mmenu.navbars
    jquery.mmenu.navbar.breadcrumbs
    jquery.mmenu.navbar.close
    jquery.mmenu.navbar.next
    jquery.mmenu.navbar.prev
    jquery.mmenu.navbar.searchfield
    jquery.mmenu.navbar.title
  )

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.navbars.min.js" do
  watch ('dist/addons/js/jquery.mmenu.navbars.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.offcanvas.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.offcanvas)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.offcanvas.min.js" do
  watch ('dist/addons/js/jquery.mmenu.offcanvas.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.searchfield.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.searchfield)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.searchfield.min.js" do
  watch ('dist/addons/js/jquery.mmenu.searchfield.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.sectionindexer.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.sectionindexer)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.sectionindexer.min.js" do
  watch ('dist/addons/js/jquery.mmenu.sectionindexer.min.js')
end


guard :concat,
  type: "js",
  output: "dist/addons/js/jquery.mmenu.toggles.min",
  input_dir: "src/addons/js",
  files: %w(jquery.mmenu.toggles)

guard 'uglify', :destination_file => "dist/addons/js/jquery.mmenu.toggles.min.js" do
  watch ('dist/addons/js/jquery.mmenu.toggles.min.js')
end




# Concatenate core + offcanvas

guard :concat,
  type: "js",
  output: "dist/core/js/jquery.mmenu.min",
  input_dir: "dist",
  files: %w(
    core/js/jquery.mmenu.oncanvas.min
    addons/js/jquery.mmenu.offcanvas.min
  )




# Concatenate core + offcanvas + addons

guard :concat, 
  type: "js",
  output: "dist/core/js/jquery.mmenu.min.all",
  input_dir: "dist",
  files: %w(
    core/js/jquery.mmenu.min
    addons/js/jquery.mmenu.autoheight.min
    addons/js/jquery.mmenu.backbutton.min
    addons/js/jquery.mmenu.counters.min
    addons/js/jquery.mmenu.dividers.min
    addons/js/jquery.mmenu.dragopen.min
    addons/js/jquery.mmenu.fixedelements.min
    addons/js/jquery.mmenu.iconpanels.min
    addons/js/jquery.mmenu.navbars.min
    addons/js/jquery.mmenu.searchfield.min
    addons/js/jquery.mmenu.sectionindexer.min
    addons/js/jquery.mmenu.toggles.min
  )




# UMD core + offcanvas

guard :concat,
  type: "js",
  output: "dist/core/js/umd/jquery.mmenu.umd",
  input_dir: "dist",
  files: %w(
  	../src/core/js/umd/prefix
    core/js/jquery.mmenu.min
    ../src/core/js/umd/affix
  )




# UMD core + offcanvas + addons

guard :concat, 
  type: "js",
  output: "dist/core/js/umd/jquery.mmenu.umd.all",
  input_dir: "dist",
  files: %w(
  	../src/core/js/umd/prefix
    core/js/jquery.mmenu.min.all
    ../src/core/js/umd/affix
  )




# Minify 3rd party addons

guard :concat,
  type: "js",
  output: "dist/3rdparty/addons/js/jquery.mmenu.currentitem.min",
  input_dir: "src/3rdparty/addons/js",
  files: %w(jquery.mmenu.currentitem)

guard 'uglify', :destination_file => "dist/3rdparty/addons/js/jquery.mmenu.currentitem.min.js" do
  watch ('dist/3rdparty/addons/js/jquery.mmenu.currentitem.min.js')
end


guard :concat,
  type: "js",
  output: "dist/3rdparty/addons/js/jquery.mmenu.dragclose.min",
  input_dir: "src/3rdparty/addons/js",
  files: %w(jquery.mmenu.dragclose)

guard 'uglify', :destination_file => "dist/3rdparty/addons/js/jquery.mmenu.dragclose.min.js" do
  watch ('dist/3rdparty/addons/js/jquery.mmenu.dragclose.min.js')
end