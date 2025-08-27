import json
from datetime import datetime, timedelta

# Images and users
images = [
    "blog_images/afropolo.jpeg",
    "blog_images/joey.jpeg",
    "blog_images/ghanaGotTalent.jpeg",
    "blog_images/miss_Ghana.jpg",
    "blog_images/samini.jpeg"
]
users = [
    {"id": 3, "name": "Ama Serwaa"},
    {"id": 4, "name": "Kwame Mensah"}
]

# Uneven post content per category
post_contents = [
    # Technology (4)
    {"title": "Best Python IDEs", "content": "Choosing the right IDE can enhance your Python experience. PyCharm, VS Code, and Jupyter Notebook are top picks.", "category": "Technology"},
    {"title": "Latest Tech Trends in 2025",
        "content": "AI, quantum computing, and edge devices are shaping the future of technology this year.", "category": "Technology"},
    {"title": "How to Build a Personal Website",
        "content": "Learn to build and deploy your own website using modern tech stacks like React and Django.", "category": "Technology"},
    {"title": "Tech Gadgets Review",
        "content": "We review the latest gadgets in the market, from smartwatches to VR headsets.", "category": "Technology"},
    # Education (2)
    {"title": "Top 5 Programming Languages",
        "content": "Python, JavaScript, Java, C#, and Go are the most popular languages for students and professionals.", "category": "Education"},
    {"title": "How to Study Effectively",
        "content": "Active recall, spaced repetition, and good note-taking are keys to academic success.", "category": "Education"},
    # Entertainment (5)
    {"title": "Blockbuster Movies of 2025",
        "content": "This year's biggest hits include sci-fi adventures and superhero epics.", "category": "Entertainment"},
    {"title": "Top 10 Viral Memes",
        "content": "From dancing cats to clever puns, these memes took the internet by storm.", "category": "Entertainment"},
    {"title": "Music Festivals You Can't Miss",
        "content": "Experience the best live performances at global music festivals this season.", "category": "Entertainment"},
    {"title": "Celebrity Interviews",
        "content": "Exclusive interviews with your favorite stars and artists.", "category": "Entertainment"},
    {"title": "TV Series to Binge Watch",
        "content": "Our picks for the most addictive TV series this year.", "category": "Entertainment"},
    # Lifestyle (3)
    {"title": "Healthy Habits for Programmers",
        "content": "Stay active, eat well, and take breaks to maintain a balanced lifestyle.", "category": "Lifestyle"},
    {"title": "Work-Life Balance Tips",
        "content": "Set boundaries, prioritize tasks, and make time for hobbies to avoid burnout.", "category": "Lifestyle"},
    {"title": "Minimalist Living Guide",
        "content": "Declutter your space and mind for a more fulfilling life.", "category": "Lifestyle"},
    # Sports (1)
    {"title": "Sports Analytics Revolution",
        "content": "Data science is transforming how teams strategize and win games.", "category": "Sports"}
]


def generate_posts():
    posts = []
    now = datetime.utcnow()
    for i, post_data in enumerate(post_contents):
        post = {
            "title": post_data["title"],
            "content": post_data["content"],
            "coverImage": images[i % len(images)],
            "author": users[i % len(users)]["id"],
            "category": post_data["category"],
            "created_at": (now + timedelta(minutes=i*5)).strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        posts.append(post)
    return posts


def main():
    posts = generate_posts()
    with open("post.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=4)
    print("post.json updated with uneven posts per category.")


if __name__ == "__main__":
    main()
