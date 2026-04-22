from django.urls import path
from .views import UserProfileView, FollowToggleView, UserSearchView, SuggestedUsersView

urlpatterns = [
    path('search/', UserSearchView.as_view()),
    path('suggested/', SuggestedUsersView.as_view()),
    path('<str:username>/', UserProfileView.as_view()),
    path('<str:username>/follow/', FollowToggleView.as_view()),
]
