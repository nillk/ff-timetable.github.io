// import React from "react"

// import FormControl from "@material-ui/core/FormControl"
// import InputLabel from "@material-ui/core/InputLabel"
// import Input from "@material-ui/core/Input"
// import Select from "@material-ui/core/Select"
// import MenuItem from "@material-ui/core/MenuItem"
// import Chip from "@material-ui/core/Chip"

// export default ({ label, value, onChange }) => {
//   const [ selectedValue, setValue ] = React.useState([])

//   const handleChange = event => {
//     onChange(event.target.value)
//     setValue(event.target.value)
//   }

//   return (
//     <FormControl style={{ minWidth: `6.5rem`, maxWidth: `18rem`, marginBottom: `1rem` }}>
//       <InputLabel htmlFor="select-multiple">{label}</InputLabel>
//       <Select
//         multiple
//         value={selectedValue}
//         onChange={handleChange}
//         input={<Input id="select-multiple" />}
//         renderValue={selected => (
//           <div style={{ display: `flex`, flexWrap: `wrap` }}>
//             {selected.map(value => (
//               <Chip key={value} label={value} size="small" style={{ margin: `0.125rem`, fontSize: `0.75rem` }} />
//             ))}
//           </div>
//         )}
//       >
//         {value.map(v=> (
//           <MenuItem key={v} value={v} style={{ fontSize: `0.75rem`, minHeight: `2.25rem` }}>
//             {v}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   )
// }