import { createMuiTheme } from "@material-ui/core/styles"

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Spoqa Han Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(",")
  }
});

export default theme;