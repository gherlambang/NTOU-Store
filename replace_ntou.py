import os
import re

# Function to replace 'amazon' with 'ntou' in file contents and file names
def replace_amazon_with_ntou(base_dir):
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Update only relevant files (JS, CSS, HTML)
            if file.endswith(('.js', '.css', '.html')): 
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace 'amazon' with 'ntou'
                updated_content = re.sub(r'amazon', 'ntou', content, flags=re.IGNORECASE)
                
                # Write updated content back to file
                if updated_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                    print(f"Updated content in: {file_path}")
            
            # Rename files containing 'amazon'
            if 'amazon' in file.lower():
                new_file_name = re.sub(r'amazon', 'ntou', file, flags=re.IGNORECASE)
                new_file_path = os.path.join(root, new_file_name)
                os.rename(file_path, new_file_path)
                print(f"Renamed file: {file_path} -> {new_file_path}")

# Run the replacement script
if __name__ == "__main__":
    project_directory = "./"  # Set this to your project directory path
    replace_amazon_with_ntou(project_directory)
    print("Replacement complete!")
