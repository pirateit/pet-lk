import * as shell from "shelljs";

shell.cp("-R", "src/public/js", "dist/public/js/");
shell.cp("-R", "src/public/fonts", "dist/public/fonts/");
shell.cp("-R", "src/public/img", "dist/public/img/");
