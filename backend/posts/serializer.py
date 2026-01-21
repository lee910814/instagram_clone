from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post


User = get_user_model()

class FeedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','profile_image')


class PostSerializer(serializers.ModelSerializer):
    author = FeedUserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = '__all__' # 모든 필드 (id,author,image,caption, created_at)을 json으로 바꿈
