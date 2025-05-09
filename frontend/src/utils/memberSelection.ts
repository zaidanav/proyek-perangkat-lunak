import { type Ref, ref, computed } from "vue"
import { type Member } from "@/types/member"

const selectedMembersMap : Ref<Map<number, Member>> = ref(new Map<number, Member>());

const isEmpty = computed(() => selectedMembersMap.value.size === 0);
const selectedCount = computed(() => Array.from(selectedMembersMap.value.values()).length);

const selectMembers = (members: Member[]) => {
  members.forEach(member => {selectMember(member)});
}

const selectMember = (member: Member) => {
  selectedMembersMap.value.set(member.id, member);
}

const deselectMember = (member: Member) => {
  selectedMembersMap.value.delete(member.id);
}

const clearSelectedMembers = () => {
  selectedMembersMap.value.clear();
}

// Taken from https://docxtemplater.com/docs/get-started-browser/
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx-js-style'

const backendURL = import.meta.env.VITE_API_BASE_URL;
const exportToFile = () => {
    PizZipUtils.getBinaryContent(backendURL + "/static/templateExample.docx", function(
      error,
      content
    ) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.render({
        "member" : Array.from(selectedMembersMap.value.values())
      });
      
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // Output the document using Data-URI
      saveAs(out, "output.docx");
    })
  };

  const exportToExcel = () => {
    const membersData = Array.from(selectedMembersMap.value.values()).map(member => ({
      Name: member.name,
      Email: member.email,
      Contact: member.phone_no,
      Attendance: ""
    }));
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(membersData);
    
    worksheet['!cols'] = [
      { wch: 30 }, // Name column
      { wch: 30 }, // Email column
      { wch: 30 }, // Contact column
      { wch: 10 }  // Attendance column
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
  
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
  
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    saveAs(blob, "members.xlsx");
  };
  
  

export { selectedMembersMap, selectMember, deselectMember, clearSelectedMembers, selectMembers, isEmpty, selectedCount, exportToFile, exportToExcel }