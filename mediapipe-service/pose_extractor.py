import sys
import json
import cv2
import mediapipe as mp

def extract_pose(image_path):
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(static_image_mode=True)

    image = cv2.imread(image_path)

    if image is None:
        print(json.dumps({"error": "Image not found"}))
        return

    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    result = pose.process(image_rgb)

    if not result.pose_landmarks:
        print(json.dumps({"error": "No pose detected"}))
        return

    keypoints = []

    for idx, landmark in enumerate(result.pose_landmarks.landmark):
        keypoints.append({
            "id": idx,
            "x": landmark.x,
            "y": landmark.y,
            "z": landmark.z,
            "visibility": landmark.visibility
        })

    output = {
        "total_keypoints": len(keypoints),
        "keypoints": keypoints
    }

    print(json.dumps(output))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Image path is required"}))
    else:
        extract_pose(sys.argv[1])
