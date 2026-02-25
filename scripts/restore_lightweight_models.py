import os
import shutil

src_dir = r'c:\Users\digit\LS Furniture APP\models_deploy_temp'
dst_dir = r'c:\Users\digit\LS Furniture APP\ls-lifestyle-web\public\assets\models'

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

files = os.listdir(src_dir)
moved_count = 0

for f in files:
    src_path = os.path.join(src_dir, f)
    if os.path.isfile(src_path):
        size_mb = os.path.getsize(src_path) / (1024 * 1024)
        if size_mb < 2.0:
            dst_path = os.path.join(dst_dir, f)
            print(f"Moving {f} ({size_mb:.2f} MB)")
            shutil.move(src_path, dst_path)
            moved_count += 1

print(f"Successfully moved {moved_count} lightweight models.")
