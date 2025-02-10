from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this
import pandas as pd
import os
import tempfile
import json  # Add this

app = Flask(__name__)
CORS(app)  # Enable CORS
app.config['UPLOAD_FOLDER'] = tempfile.mkdtemp()

@app.route('/process', methods=['POST'])
def process_data():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        # Use json.loads instead of eval
        wells = request.form.get('wells')
        if not wells:
            return jsonify({"error": "No wells selected"}), 400
        selected_wells = json.loads(wells)  # Changed from eval

        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(temp_path)

        # Add file type validation
        ALLOWED_EXTENSIONS = {'csv', 'eds'}
        def allowed_file(filename):
            return '.' in filename and \
                   filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
                   
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        if file.filename.endswith('.csv'):
            df = pd.read_csv(temp_path)
            # Make sure column name matches your CSV
            filtered_data = df[df['Well'].isin(selected_wells)]
            
        elif file.filename.endswith('.eds'):
            with open(temp_path, 'r') as f:
                eds_content = f.read()
            filtered_data = process_eds(eds_content, selected_wells)

        os.remove(temp_path)

        return jsonify({
            "message": "Processed successfully",
            "selected_wells": selected_wells,
            "data_sample": filtered_data.head().to_dict() if not filtered_data.empty else {}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_eds(eds_content, selected_wells):
    return {"content": eds_content[:100], "wells": selected_wells}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Add host parameter