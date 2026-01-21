from django.db import models
from django.conf import settings #유저 모델을 가져오기 위한 설정

class Post(models.Model):

    # on_delete=models.CASCADE : 유저가 탈퇴하면 게시글도 같이 삭제된다는 뜻 
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)

    image = models.ImageField(upload_to='posts/%Y/%m/%d')

    caption = models.TextField(blank=True)

    create_at = models.DateTimeField(auto_now_add=True)


def __Str__(self):
    return f"{self.auth}의 게시글 : {self.caption[:10]}"