from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, LikeToggleView, CommentListCreateView, CommentDeleteView, UserPostsView

router = DefaultRouter()
router.register('', PostViewSet, basename='post')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:post_id>/like/', LikeToggleView.as_view()),
    path('<int:post_id>/comments/', CommentListCreateView.as_view()),
    path('comments/<int:pk>/', CommentDeleteView.as_view()),
    path('user/<str:username>/', UserPostsView.as_view()),
]
