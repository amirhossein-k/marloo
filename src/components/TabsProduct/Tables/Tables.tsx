
const Tables = ({tableContent}: {tableContent:string }) => {
  return (
    <div className="p-4 border border-gray-300" >
    <div className="mt-4 p-4 border bg-gray-100">
   {/* <h2 className="font-semibold mb-2">پیش‌نمایش:</h2> */}
   {tableContent && (
     <div
       className="preview-content space-y-2 text-black " 
       dangerouslySetInnerHTML={{ __html: tableContent }}
     />
   )}
 </div>
   </div>
  )
}
export default Tables
