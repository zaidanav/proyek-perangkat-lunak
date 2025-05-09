

import { type Ref, ref } from "vue"
import type { Note } from '@/views/NoteListView.vue';

const selectedNotesMap: Ref<Map<number, Note>> = ref(new Map<number, Note>());

selectedNotesMap.value.set(1, {
  id: 1,
  notes: "Alice menunjukkan perkembangan positif dalam hal kecepatan dan refleks. Namun, masih perlu latihan intensif untuk meningkatkan kelincahan lateral serta kemampuan menjaga stamina dalam sesi latihan berdurasi panjang.",
  status: 'active',
  created_at: "2025-04-01", // Assumed creation date
  end_date: "2025-04-24",
  memberId: 1,
  trainer_id: 101, // Assumed trainer ID
  updated_at: "2025-04-10" // Assumed update date
});

selectedNotesMap.value.set(2, {
  id: 2,
  notes: "Bob memiliki kekuatan fisik yang solid, tetapi teknik dasar seperti posisi tangan dan keseimbangan tubuh saat menerima bola masih kurang stabil. Direkomendasikan latihan tambahan selama 3 sesi per minggu untuk memperkuat teknik tersebut.",
  status: 'active',
  created_at: "2025-04-02", // Assumed creation date
  end_date: "2025-04-22",
  memberId: 2,
  trainer_id: 102, // Assumed trainer ID
  updated_at: "2025-04-09" // Assumed update date
});

selectedNotesMap.value.set(3, {
  id: 3,
  notes: "Charlie perlu meningkatkan fokus selama latihan karena sering kehilangan konsentrasi saat sesi berlangsung lebih dari 30 menit. Latihan konsentrasi serta simulasi pertandingan dalam durasi yang lebih panjang bisa sangat membantu.",
  status: 'active',
  created_at: "2025-04-03", // Assumed creation date
  end_date: "2025-04-20",
  memberId: 3,
  trainer_id: 101, // Assumed trainer ID
  updated_at: "2025-04-08" // Assumed update date
});

  

// Taken from https://docxtemplater.com/docs/get-started-browser/
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs }  from "file-saver";

const backendURL = import.meta.env.VITE_API_BASE_URL;
const exportTrainerNotes = (notes: Note[]) => {
  PizZipUtils.getBinaryContent(backendURL + "/static/templateExample2.docx", function(
    error,
    content
  ) {
    if (error) {
      throw error;
    }
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    
    doc.render({
      "note": notes
    });
    
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
    
    saveAs(out, "trainer-notes.docx");
  });
};


export {exportTrainerNotes }
