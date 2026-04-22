from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Follow

User = get_user_model()


class UserDetailSerializer(serializers.ModelSerializer):
    """dj-rest-auth의 /auth/user/ 엔드포인트에서 사용"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile_image', 'bio', 'website')


class UserMinimalSerializer(serializers.ModelSerializer):
    """피드·댓글 등에서 작성자 정보를 간단히 표시할 때"""
    class Meta:
        model = User
        fields = ('id', 'username', 'profile_image')


class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    posts_count = serializers.IntegerField(read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'profile_image', 'bio', 'website',
            'followers_count', 'following_count', 'posts_count', 'is_following',
        )

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False
