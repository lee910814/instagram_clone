from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import Post
from .serializer import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    #어떤 데이터를 사용할건지?
    queryset = Post.objects.all().order_by('-created_at')

    #어떤 변환기를 사용할 것인지?
    serializer_class = PostSerializer

    #권한 설정(로그인 안하면 읽기만, 로그인시 글쓰기도 가능)
    permission_classes = [AllowAny]

    # 글 저장할 때 작성자 자동 입력
    def perform_create(self, serializer):
        serializer.save()