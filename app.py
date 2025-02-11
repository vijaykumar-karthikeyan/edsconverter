from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import json
import tempfile
import os
import natsort
from datetime import datetime

app = Flask(__name__)
CORS(app)

def process_file(temp_path, selected_wells):
    """Your data processing logic wrapped in a function"""
    # Find header row with X1_M1
    header_row = 0
    with open(temp_path, "r") as file:
        for i, line in enumerate(file):
            if "X1_M1" in line:
                header_row = i
                break

    # Read and process data
    # Read and process data with better error handling
    # Read CSV safely with error handling
    try:
        raw_data = pd.read_csv(temp_path, skiprows=header_row, on_bad_lines='skip', engine='python')
    except pd.errors.ParserError as e:
        print(f"Error parsing CSV file: {e}")
        return jsonify({"error": "Invalid CSV format. Please check your file."}), 400


    raw_data = raw_data.drop(columns=["X2_M2", "X4_M4", "X3_M3", "X5_M5"], errors='ignore')
    df = raw_data.sort_values(by=["Well Position", "Cycle Number"])
    
    # Natural sort and filter
    well_positions_sorted = natsort.natsorted(df['Well Position'].unique())
    kd_data = []
    
    for well_position in well_positions_sorted:
        well_data = df[df['Well Position'] == well_position].iloc[:37]['X1_M1'].values
        kd_data.append(well_data)
    
    kd = pd.DataFrame(kd_data).T
    kd.columns = well_positions_sorted
    
    # Filter based on selected wells
    kd_filtered = kd[selected_wells]
    
    # Generate timestamped filename
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    output_filename = f"kd_{timestamp}.csv"
    
    # Save to temporary file
    temp_dir = tempfile.mkdtemp()
    output_path = os.path.join(temp_dir, output_filename)
    kd_filtered.to_csv(output_path, index=False)
    
    return output_path

import shutil  # Add this import for deleting directories

@app.route('/process', methods=['POST'])
def process_data():
    temp_dirs = []  # Track directories for cleanup
    try:
        # Validate input
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        # Get selected wells
        wells = request.form.get('wells')
        if not wells:
            return jsonify({"error": "No wells selected"}), 400
        try:
            selected_wells = json.loads(wells)
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Invalid JSON in 'wells' field: {str(e)}"}), 400


        # Save uploaded file temporarily
        temp_dir = tempfile.mkdtemp()
        temp_dirs.append(temp_dir)  # Track for deletion
        upload_path = os.path.join(temp_dir, file.filename)
        file.save(upload_path)

        # Process data
        output_path = process_file(upload_path, selected_wells)
        temp_dirs.append(os.path.dirname(output_path))  # Track output directory

        # Send file for download
        return send_file(
            output_path,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f"processed_{os.path.basename(output_path)}"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Cleanup all tracked directories
        for directory in temp_dirs:
            try:
                shutil.rmtree(directory)  # Removes all files and subdirectories
            except Exception as e:
                print(f"Error cleaning up {directory}: {str(e)}")

@app.route('/cleanup', methods=['POST'])
def cleanup():
    temp_base = tempfile.gettempdir()
    
    try:
        # Find and remove all temporary directories created by the app
        for folder in os.listdir(temp_base):
            temp_path = os.path.join(temp_base, folder)
            if os.path.isdir(temp_path) and "kd_" in folder:
                shutil.rmtree(temp_path)
        return jsonify({"message": "Cleanup successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)