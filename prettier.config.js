{
  overrides: [
    {
      files: "prettier.config.js",
      options: {
        parser: "flow"
      }
    },
    {
      files: "*.ts",
      options: {
        parser: "typescript"
      }
    },
    {
      files: "*.html?",
      options: {
        parser: "angular-html-parser"
      }
    },
    {
      files: "*.css",
      options: {
        parser: "css"
      }
    }
  ];
}
