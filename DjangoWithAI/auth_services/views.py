from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    if not username or not email or not password:
        return Response({'error': 'Please provide all required fields'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    print(f"DEBUG: Received email: '{email}'")
    print(f"DEBUG: Received password: '{password[:3] if password else 'None'}...' (length: {len(password) if password else 0})")

    if not email or not password:
        print("DEBUG: Missing email or password")
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if user exists
    try:
        user_check = User.objects.get(email=email)
        print(f"DEBUG: User found - username: {user_check.username}, email: {user_check.email}")
    except User.DoesNotExist:
        print(f"DEBUG: No user found with email: {email}")
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # authenticate -> username=email (since we created users with username=email)
    print(f"DEBUG: Attempting authentication with username='{email}'")
    # Note: authenticate() expects 'username' kwarg to match the USERNAME_FIELD or the actual username.
    # If the user registered with username=email, this is correct.
    # If they registered with a different username, we might need to use user_check.username
    user = authenticate(username=email, password=password)
    
    if not user:
        # Fallback: try authenticating with the username found from the email
        print(f"DEBUG: Authentication failed with email as username. Trying username: {user_check.username}")
        user = authenticate(username=user_check.username, password=password)

    if not user:
        print(f"DEBUG: Authentication FAILED for {email}")
        # Try checking password manually
        if user_check.check_password(password):
            print(f"DEBUG: Password is CORRECT but authenticate() failed!")
        else:
            print(f"DEBUG: Password is INCORRECT")
        
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    print(f"DEBUG: Authentication SUCCESSFUL for {email}")

    # Generate JWT tokens directly from authenticated user
    refresh = RefreshToken.for_user(user)
    
    print(f"DEBUG: Generated tokens successfully")
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_200_OK)