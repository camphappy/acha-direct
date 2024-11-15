Option Explicit

' rename International Silver xlsx files to conform to the following format:
' {filename}-invoiceNumber-orderNumber.xlsx

' Function to get today's date in ddmmyy format

' Main script logic
' Define the source directory
Dim sourceFolder, file, fso, originalFileName, extension, basename, newBaseName, newFileName
Dim outputDir, successDir, filePath

Set fso = CreateObject("Scripting.FileSystemObject")
Set sourceFolder = fso.GetFolder(".\sourceAcha2023")
set outputDir = fso.GetFolder(".\good2023")
set successDir = fso.GetFolder(".\success") ' Define success folder

' Loop through each file in the source directory
For Each file In sourceFolder.Files
    ' Only process files with .xlsx extension
    filePath = file.Path
    originalFileName = file.Name
    If LCase(fso.GetExtensionName(file.Name)) = "xlsx" Then
        ' Step 1: Split the filename into basename and extension
        extension = Right(originalFileName, Len(originalFileName) - InStrRev(originalFileName, "."))
        basename = Left(originalFileName, InStrRev(originalFileName, ".") - 1)

        ' Step 2: Create newBaseName by removing "-NEW TERM" and anything following it
        Dim position
        position = InStr(basename, "-NEW TERM")
        If position > 0 Then
            newBaseName = Left(basename, position - 1)
        Else
            newBaseName = basename
        End If

        ' Step 3: Create the newFileName by combining newBaseName and extension
        newFileName = newBaseName & "." & extension

        ' Rename the file
        'file.Move sourceFolder & "\" & newFileName


        ' Copy the file with the new name
        fso.CopyFile filePath, fso.BuildPath(outputDir, newFileName)

        ' Move the original file to the success folder after processing
        fso.MoveFile filePath, fso.BuildPath(successDir, originalFileName)

        ' Log message
        WScript.Echo "File copied to: " & fso.BuildPath(outputDir, newFileName) & " and moved to success folder."
    

        ' Display the original and new filename
        WScript.Echo "Renamed '" & originalFileName & "' to '" & newFileName & "'"
    End If
Next

' Clean up
Set file = Nothing
Set sourceFolder = Nothing
Set fso = Nothing