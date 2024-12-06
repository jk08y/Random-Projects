import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud

# Load the JSON data
with open('debate_4_livechat.json', 'r') as file:
    data = json.load(file)

# Convert JSON to DataFrame
df = pd.DataFrame(data)

# Data Cleaning and Transformation
df['publishedAt'] = pd.to_datetime(df['publishedAt'], errors='coerce')
df['likeCount'] = pd.to_numeric(df['likeCount'], errors='coerce').fillna(0).astype(int)
df['debate_number'] = df['debate_number'].astype(str)

# Create a 'date' column for daily aggregation
df['date'] = df['publishedAt'].dt.date

# Set style for plots
sns.set_theme(style="whitegrid")

# 1. Comments Over Time (Line Chart)
plt.figure(figsize=(10, 6))
comments_over_time = df.groupby('publishedAt').size()
sns.lineplot(x=comments_over_time.index, y=comments_over_time.values, marker='o', color='blue')
plt.title('Comments Over Time')
plt.xlabel('Published Time')
plt.ylabel('Number of Comments')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('comments_over_time.png')
plt.close()

# 2. Comment Distribution by Author (Bar Chart)
top_authors = df['author'].value_counts().head(10)
plt.figure(figsize=(10, 6))
sns.barplot(x=top_authors.values, y=top_authors.index, legend=False)
plt.title('Top 10 Authors by Number of Comments')
plt.xlabel('Number of Comments')
plt.ylabel('Author')
plt.tight_layout()
plt.savefig('author_distribution_livechat.png')
plt.close()

# 3. Comments Per Day (Bar Chart)
comments_per_day = df.groupby('date').size()
plt.figure(figsize=(10, 6))
sns.barplot(x=comments_per_day.index, y=comments_per_day.values, color='purple', legend=False)
plt.title('Comments Per Day')
plt.xlabel('Date')
plt.ylabel('Number of Comments')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('comments_per_day_livechat.png')
plt.close()

# 4. Top Comments by Likes (Horizontal Bar Chart)
top_comments = df.nlargest(10, 'likeCount')
plt.figure(figsize=(10, 6))
sns.barplot(x=top_comments['likeCount'], y=top_comments['text'], legend=False)
plt.title('Top 10 Comments by Likes')
plt.xlabel('Number of Likes')
plt.ylabel('Comment')
plt.tight_layout()
plt.savefig('top_comments_livechat.png')
plt.close()

# 5. Word Frequency in Comments (Word Cloud)
text = ' '.join(comment for comment in df['text'] if isinstance(comment, str))
wordcloud = WordCloud(width=800, height=400, background_color='white', colormap='viridis').generate(text)
plt.figure(figsize=(12, 6))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')
plt.title('Most Frequent Words in Comments')
plt.tight_layout()
plt.savefig('wordcloud_livechat.png')
plt.close()

# 6. Likes Distribution (Histogram)
plt.figure(figsize=(10, 6))
sns.histplot(df['likeCount'], bins=20, kde=True, color='orange')
plt.title('Distribution of Likes')
plt.xlabel('Number of Likes')
plt.ylabel('Frequency')
plt.tight_layout()
plt.savefig('likes_distribution_livechat.png')
plt.close()

# 7. Source Distribution (Pie Chart)
source_distribution = df['Source'].value_counts()
plt.figure(figsize=(8, 8))
source_distribution.plot.pie(autopct='%1.1f%%', startangle=140, colors=sns.color_palette('pastel'))
plt.title('Distribution of Sources')
plt.ylabel('')
plt.tight_layout()
plt.savefig('source_distribution_livechat.png')
plt.close()
