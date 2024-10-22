import google.generativeai as genai
import os
import json

class ChatgptRunner:
    def processGemini(self, pname):
        os.environ["API_KEY"] = 'AIzaSyABZX8cvpBPUcAwL6rS_frB6E0afbmhrtA'
        genai.configure(api_key=os.environ["API_KEY"])

        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        query = "Provide the activities of a " + pname + ". store it in a python list named as items."
        response = model.generate_content(query)
        clean_text = response.text.replace("items =", "").replace("[", "").replace("]", "").replace("python", "").replace("\n", "").replace("`", "").replace("  ", "").replace("\\", "").strip()
        split_text = clean_text.split(",")
        new_list = []
        for split in split_text:
            clean_splits = split.replace('"', "").strip()
            new_list.append(clean_splits)
        return new_list
